async function test() {
    const payload = {
        prompt: "cat",
        model: "flux",
        size: "1024x576",
        seed: 123,
        nologo: true
    };
    const fetchRes = await fetch('https://gen.pollinations.ai/v1/images/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await fetchRes.json();
    console.log(JSON.stringify(data, null, 2));
}
test();
