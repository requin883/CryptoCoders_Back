let output = content => ({
    statusCode: 200,
    body: JSON.stringify(content)
});

module.exports={output}