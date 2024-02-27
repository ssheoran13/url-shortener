require('dotenv').config();
const express = require('express');
const cors = require('cors');
let bodyParser=require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({extended:false}))

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// app.use((req,res,next)=>{
//   console.log(req.body)
//   next()
// })

let dict={}

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


let cnt=0
app.post('/api/shorturl', (req,res)=>{
  const dns = require('node:dns');
  let input_url=req.body.url
  if (input_url[0]!=='h'){
    res.json({error:'invalid url'})
  }
  try{
    const {urlObject}=new URL(input_url)
    dns.lookup(input_url.hostname,(err)=>{
      if (err){
        console.error(err)
        res.json({error:'invalid url'})
      }
      else{
        cnt+=1;
        console.log(req.body)
        console.log("Current count:",cnt)
        res.json({original_url:input_url, short_url:cnt})
        dict[cnt]=input_url
      }
    })
  }
  catch (e){
    res.json({error:'invalid url'})
  }  
  
})

app.get('/api/shorturl/:curr_url',(req,res)=>{
  let shorturl=req.params.curr_url;
  console.log(shorturl)
  if (shorturl in dict){
    // res.json({actual_url:dict[shorturl], shorturl: shorturl})
    res.redirect(dict[shorturl]);
  }
  else{
    res.json({error:'does not exist'})
  }
  
})

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
