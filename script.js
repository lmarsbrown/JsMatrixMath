let n = 10;
let A = new SquareMatrix(n);

// let M = new SquareMatrix(4);
// M.identity();


// let coeffs = [1];

// for(let i = 0; i < n*n; i++)
// {
//     A.arr[i] = Math.random()*2-1;
// }

let det = A.determinant();
let tr = A.trace();
let scale = 1;
A.scale(1/Math.pow(det,1/n))

let vec0 = new Vector(n);
let vec1 = new Vector(n);





// for(let k = 1; k < 5; k++)
// {
//     A.mul(M,M);
//     let c = -(1/k) * M.trace();
//     M.addIdentity(c);
//     coeffs.push(c);
// }
