import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const API_KEY = 'ddYHS2NAM2czVSYpP54Gz5rF';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    const imageBuffer = await imageFile.arrayBuffer();

    const form = new FormData();
    form.append('image_file', new Blob([imageBuffer], { type: imageFile.type }), imageFile.name);
    form.append('size', 'auto');
    form.append('format', 'png');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: 'Remove.bg API failed',
        details: errorText 
      }, { status: 500 });
    }

    const resultBuffer = await response.arrayBuffer();

    return new NextResponse(resultBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="removed-bg-${imageFile.name.replace(/\.[^.]+$/, '')}.png"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
