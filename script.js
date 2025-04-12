let n = 5*5;
let A = new SquareMatrix(n);
let A_inv = new SquareMatrix(n);

for(let i = 0; i < n; i++)
{
    let vecX = (i % 5) - 2;
    let vecY = (Math.floor(i / 5));
    for(let j = 0; j < n; j++)
    {
        let pixX = (j % 5) - 2;
        let pixY = (Math.floor(j / 5));

        let dist = Math.hypot(pixX-vecX,pixY-vecY);
        if(dist == 0.0)
        {
            A.setItem(
                1.06117542688,
                i,j
            );
        }
        else
        {
            A.setItem(
                -Math.log(dist),
                i,j
            );
        }
    }
}

A.invert(A_inv)

let vec = new Vector(n);
for(let i = 0; i < n; i++)
{
    vec.arr[i] = 1.0//i%5;
}

A_inv.mul(vec,vec);

// let M = new SquareMatrix(4);
// M.identity();


// let coeffs = [1];

// for(let i = 0; i < n*n; i++)
// {
//     A.arr[i] = Math.random()*2-1;
// }

// let det = A.determinant();
// let tr = A.trace();
// let scale = 1;
// A.scale(1/Math.pow(det,1/n))

// let vec0 = new Vector(n);
// let vec1 = new Vector(n);





// for(let k = 1; k < 5; k++)
// {
//     A.mul(M,M);
//     let c = -(1/k) * M.trace();
//     M.addIdentity(c);
//     coeffs.push(c);
// }
