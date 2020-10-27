const arweave = Arweave.init({
    host:"arweave.net",
    port:443,
    logging:!0,
    protocol:"https"
});

var xar ;
function saveSpaceEthernalScores(files) {
    var xfiles = new FileReader();
    xfiles.onload = async function (ev) {
       try {
           xar = JSON.parse(ev.target.result);
           console.log(xar);

           var sd = await goToData(xar);
           document.getElementById('pro').style.display = 'none';
           document.getElementById('wrap').style.display = 'block';
           if (sd == true) {
              alert('Success send data ...');

           } else {
              alert('Failed send data !');
           }
       } catch (err) {
          console.log(err);
       }
    }
    xfiles.readAsText(files[0])
}


async function goToData() {
    document.getElementById('pro').style.display = 'block';
    document.getElementById('wrap').style.display = 'none';
    var sendDate = Date.now();
    var sendScore = Math.max( $.storage['score'], $.score );
    var sendRand = Math.floor(Math.random() * 100);
    var sendData = Number(sendScore) * Number(sendRand);

    console.log(sendData.toString());
    console.log(sendScore);
    console.log(sendRand);
    console.log(sendDate);

    try {
          let w =  await arweave.createTransaction({
              data: sendData.toString()
          }, xar)

          w.addTag('Content-Type', 'text/html');
          w.addTag('Perma-name', 'SpaceEthernal');
          w.addTag('Version', '1.0');
          w.addTag('Score', sendScore.toString());
          w.addTag('Date', sendDate.toString());
          w.addTag('Calculate', sendRand.toString());

         await arweave.transactions.sign(w, xar);
         const response = await arweave.transactions.post(w);
         if (response.status === 200) {
            return true;
         }
    } catch (err) {
            return false;
    }
}
