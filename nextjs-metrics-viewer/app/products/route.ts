export async function GET(request: Request) {
  try {
    const response = await fetch('http://localhost:3001/products', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const products = await response.json()
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Ha ocurrido un error" }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.length < 1) {
      return new Response(JSON.stringify({ message: "Error al crear datos" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    const transformedData = body.map((item: any) => ({
      date: item[0],
      category: item[1],
      value: parseInt(item[2])
    }));

    const promises = transformedData.map(async (item: any) => {
      await fetch('http://localhost:3001/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item)
      });
    });

    await Promise.all(promises);

    return new Response(JSON.stringify({ message: "Productos creados" }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {

    return new Response(JSON.stringify({ message: "Error al crear datos" }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}