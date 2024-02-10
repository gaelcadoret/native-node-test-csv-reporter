import { createClient } from 'redis';



    /**
     * Generate QRCode data to be encrypt
     * @param key
     */
;(async () => {
    console.log('script start...');

    const client = await createClient({
        url: 'redis://localhost:6379',
    })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    await client.set('key', 'value');
    const value = await client.get('key');

    console.log('value', value)

    await client.disconnect();

    console.log('the end.')
})();