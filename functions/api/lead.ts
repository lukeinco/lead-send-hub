interface Env {
  N8N_WEBHOOK_URL: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.N8N_WEBHOOK_URL) {
    return new Response('Missing N8N_WEBHOOK_URL Pages variable.', { status: 500 });
  }

  try {
    const formData = await request.formData();

    const response = await fetch(env.N8N_WEBHOOK_URL, {
      method: 'POST',
      body: formData,
    });

    const text = await response.text();

    return new Response(text || JSON.stringify({ ok: response.ok }), {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : 'Request failed',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
};
