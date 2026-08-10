import DNS from 'dns2';

const dns = new DNS({ nameServers: ['127.0.0.1'] });

(async () => {
  try {
    const result = await dns.resolve('ader.mh', 'SRV');
    console.log(JSON.stringify(result.answers, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
