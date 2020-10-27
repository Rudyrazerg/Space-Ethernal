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

    let sendMsg = '{"data":"'+sendData+'","score":"'+sendScore+'","calculate":"'+sendRand+'","date":"'+sendDate+'"}';

    try {
          let w =  await arweave.createTransaction({
              data: sendMsg
          }, xar)

          w.addTag('Content-Type', 'text/html');
          w.addTag('Perma-name', 'SpaceEthernal');
          w.addTag('Version', '1.1');
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


window.onload = async function getScores(){
    const scores = await arweave.arql({
         op: "and",
         expr1: {
           op: "equals",
           expr1: "Version",
           expr2: "1.1"
         },
         expr2: {
             op:"equals",
             expr1:"Perma-name",
             expr2:"SpaceEthernal"
         }
    })

    console.log(scores);
    var c = scores.length;
    let h = [];
    scores.forEach(async function(i){
      try {
        const y = await arweave.transactions.get(i);
        const data = y.get('data', { decode: true, string: true });
        let xdata = JSON.parse(data);
        let calc = Number(xdata.data) / Number(xdata.calculate);
        if (xdata.data !== '0') {
            if (calc.toString() === xdata.score) {
                var sfr = await arweave.wallets.ownerToAddress(y.owner);
                var z = '{"data":"'+xdata.data+'","score":"'+xdata.score+'","calculate":"'+xdata.calculate+'","date":"'+xdata.date+'","owner":"'+sfr+'"}';
                var r = JSON.parse(z);
                h.push(r);
            }
        }

        c -= 1;
        if (c === 0) {

            l = h.sort(turnOrder("-score"));
            l = h.slice(0,7);
            var num = 0;

            for (const i of l) {
              num += 1;
              var k = i.score;
              console.log(k);
              console.log(i.owner);
            }
        }
      } catch (e) {
          c -= 1;
      }
    });
}

function turnOrder(p) {
    var s = 1;
    if(p[0] === "-") {
        s = -1;
        p = p.substr(1);
    }
    return function (a,b) {
        var r = (a[p] < b[p]) ? -1 : (a[p] > b[p]) ? 1 : 0;
        return r * s;
    }
}

async function JwkTo() {
  return arweave.wallets.jwkToAddress(xar).then((address) => {
    return address;
  });
}
