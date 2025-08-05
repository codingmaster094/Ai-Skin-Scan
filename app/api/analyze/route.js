import { NextResponse } from 'next/server';
import FormData from 'form-data';


export async function POST(req) {
  const body = await req.json();
  const { image } = body;

  const formData = new FormData();
  formData.append('version', 'facf6b26cafe47e3b6a24b5047e229bb3d8e86ae5d28ea86f53f4f8a92e13659'); // faceai model version
  formData.append('input', JSON.stringify({ image }));

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error calling Replicate API', detail: error.message },
      { status: 500 }
    );
  }
}
