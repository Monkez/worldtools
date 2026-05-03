async function test() {
    const fetchRes = await fetch('https://gen.pollinations.ai/image/cat?width=1024&height=576');
    const arrayBuffer = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('Bytes:', buffer.slice(0, 10));
    console.log('String:', buffer.slice(0, 100).toString());
}
test();
