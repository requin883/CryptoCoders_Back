let output = content => ({
    statusCode: 200,
    body: JSON.stringify(content),
    headers:{
        "Access-Control-Allow-Headers":"*",
        "Access-Control-Allow-Origin":"*",
    }
});

module.exports={output}