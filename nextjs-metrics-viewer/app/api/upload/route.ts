import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import formidable from 'formidable';
import fs from 'fs';
import { initializeDatabase } from '@/lib/db';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BROADCAST_SECRET = process.env.BROADCAST_SECRET || 'broadcast-secret';
const WS_SERVER_URL = process.env.WS_SERVER_URL || 'http://localhost:3001/broadcast';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

export const config = {
    api: {
        bodyParser: false,
    },
};

type Metric = {
    date: string;
    category: string;
    value: number;
};

interface NodeStreamWithHeaders extends Readable {
    headers?: Record<string, string>;
}

const parseCSV = (filePath: string): Metric[] => {
    let data = fs.readFileSync(filePath, 'utf8');

    if (data.charCodeAt(0) === 0xFEFF) {
        data = data.slice(1);
    }

    const lines = data.replace(/\r\n/g, '\n').split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(header => header.trim());

    if (!['Date', 'Category', 'Value'].every((header) => headers.includes(header))) {
        throw new Error('CSV must contain Date, Category, and Value columns.');
    }

    return lines.slice(1).map((line) => {
        const [date, category, value] = line.split(',');
        const formattedDate = new Date(date.trim()).toISOString().split('T')[0]; // YYYY-MM-DD
        return { date: formattedDate, category: category.trim(), value: parseFloat(value.trim()) };
    });
};

const convertRequestToNodeStream = async (request: Request): Promise<NodeStreamWithHeaders> => {
    const readable = new Readable() as NodeStreamWithHeaders;
    readable._read = () => { }; 
    readable.push(Buffer.from(await request.arrayBuffer()));
    readable.push(null); 
    return readable;
};

export async function POST(req: Request) {
    console.log('Received POST request to /api/upload');

    const db = await initializeDatabase();
    const form = formidable();

    try {
        const nodeStream = await convertRequestToNodeStream(req);
        nodeStream.headers = {
            ...Object.fromEntries(req.headers),
            'content-length': req.headers.get('content-length') || '0',
        };

        const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
            form.parse(nodeStream as any, (err, fields, files) => {
                if (err) {
                    console.error('Error parsing form:', err);
                    reject(err);
                }
                resolve({ fields, files });
            });
        });

        const uploadedFile = files.file;
        const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

        if (!file || !file.filepath) {
            console.warn('No file provided in the upload');
            return NextResponse.json({ message: 'No file provided' }, { status: 400 });
        }

        console.log(`Processing file: ${file.filepath}`);
        const records = parseCSV(file.filepath);

        await db.exec('BEGIN TRANSACTION;');
        try {
            const insertStmt = `INSERT INTO metrics (date, category, value) VALUES (?, ?, ?)`;
            const batchSize = 1000; 
            for (let i = 0; i < records.length; i += batchSize) {
                const batch = records.slice(i, i + batchSize);
                const placeholders = batch.map(() => '(?, ?, ?)').join(', ');
                const flatValues = batch.flatMap(record => [record.date, record.category, record.value]);
                const query = `INSERT INTO metrics (date, category, value) VALUES ${placeholders}`;
                await db.run(query, flatValues);
            }
            await db.exec('COMMIT;');
        } catch (error) {
            await db.exec('ROLLBACK;');
            throw error;
        }

        console.log('File uploaded and data stored successfully');

        try {
            console.log('Sending broadcast message with secret:', BROADCAST_SECRET);
            await axios.post(WS_SERVER_URL, {
                message: JSON.stringify({ type: 'data-updated' }),
                secret: BROADCAST_SECRET, 
            });
            console.log('Broadcast message sent successfully');
        } catch (broadcastError) {
            console.error('Error sending broadcast message:', broadcastError);
            return NextResponse.json({ message: 'File uploaded but failed to broadcast', error: String(broadcastError) }, { status: 500 });
        }

        return NextResponse.json({ message: 'File uploaded and data stored successfully' });
    } catch (error) {
        console.error('Error processing upload:', error);
        return NextResponse.json({ message: 'Error processing file', error: String(error) }, { status: 500 });
    }
}

export async function GET(req: Request) {
    console.log('Received GET request to /api/upload');
    return NextResponse.json({ message: 'API Upload is working' });
}
