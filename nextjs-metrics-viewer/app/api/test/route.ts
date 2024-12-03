type ResponseData = {
  message: string;
};

export async function GET() {
  return Response.json({ msg: "Hola Mundo" });
}
