 
let xhr = new XMLHttpRequest()
xhr.open("GET","imgs.bin");
xhr.responseType = "arraybuffer";




xhr.onload = ()=>{
    window.images = new Uint8Array(xhr.response);
    main();
};
xhr.send();

let can = document.createElement("canvas");
can.width = 92;
can.height = 112;
document.body.appendChild(can);
let ctx = can.getContext("2d");


let imageDataset = new Matrix(320,10304);;
function main()
{
    for(let i = 0; i < images.length; i++)
    {
        imageDataset.arr[i] = images[i]/255;
    }
}

let imageNum = 0;
function drawImage()
{
    ctx.clearRect(0,0,can.width,can.height);
    for(let y = 0; y < can.height; y++)
    {
        for(let x = 0; x < can.width; x++)
        {
            let i = (y+x*can.height)*320+imageNum;
            ctx.fillStyle = `rgb(${images[i]},${images[i]},${images[i]})`;
            ctx.fillRect(x,y,1,1);
        }
    }
    imageNum++;
}

let sqMatTest = new Matrix(4,8);
let test = new Matrix(4,8);

for(let i = 0; i < sqMatTest.arr.length; i++)
{
    sqMatTest.arr[i] = Math.random()*2-1;
}

let SVD = sqMatTest.SVD();

SVD[0].mul(SVD[1],test);
test.mul(SVD[2],test);