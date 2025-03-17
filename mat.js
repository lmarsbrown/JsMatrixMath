class Matrix
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        this.arr = new Float32Array(width*height);
        this._bufferArr = new Float32Array(width*height);
    }
    clone()
    {
        let out = new Matrix(this.width,this.height);
        for(let i = 0; i < out.arr.length; i++)
        {
            out.arr[i] = this.arr[i]
        }
        return out;
    }
    copyTo(dst)
    {
        if(dst.width*dst.height != dst.width*dst.height)
        {
            throw new "Destination has different size"
        }
        for(let i = 0; i < dst.arr.length; i++)
        {
            dst.arr[i] = this.arr[i]
        }
    }
    getItem(x,y)
    {
        return this.arr[x+y*this.width];
    }
    setItem(val, x,y)
    {
        this.arr[x+y*this.width] = val;
    }
    /**
     * @param {Matrix} input 
     * @param {Matrix} output
     */
    mul(input,output)
    {
        if(this.width != input.height)
        {
            throw "Multiplication input height mismatch";
        }
        // if(this.height * input.width != output.width * output.height)
        // {
        //     throw "Input output size mismatch";
        // }
        for(let y = 0; y < this.height; y++)
        {
            for(let x = 0; x < input.width; x++)
            {
                var item = 0.0;
                for(let i = 0; i < input.height; i++)
                {
                    item += this.getItem(i,y) * input.getItem(x,i);
                }
                output._bufferArr[x + y*output.width] = item;
            }
        }
        for(let i = 0; i < output.arr.length; i++)
        {
            output.arr[i] = output._bufferArr[i];
        }

    }

    /**
     * @param {Matrix} input 
     * @param {Matrix} output
     */
    backMul(input,output)
    {
        if(this.height != input.height)
        {
            throw "Multiplication input height mismatch";
        }
        if(this.width * input.width != output.width*output.height)
        {
            throw "Input output size mismatch";
        }
        for(let y = 0; y < this.width; y++)
        {
            for(let x = 0; x < input.width; x++)
            {
                var item = 0.0;
                for(let i = 0; i < input.height; i++)
                {
                    item += this.getItem(y,i) * input.getItem(x,i);
                }
                output._bufferArr[x + y*output.width] = item;
            }
        }
        for(let i = 0; i < output.arr.length; i++)
        {
            output.arr[i] = output._bufferArr[i];
        }

    }
    add(input)
    {
        if(input.arr.length != this.arr.length)
        {
            throw "Addition input height mismatch";
        }
        for(let i = 0; i < this.arr.length; i++)
        {
            this.arr[i] += input.arr[i];
        }
    }
    scaleEntrywise(input)
    {
        if(input.arr.length != this.arr.length)
        {
            throw "Addition input height mismatch";
        }
        for(let i = 0; i < this.arr.length; i++)
        {
            this.arr[i] *= input.arr[i];
        }
    }
    sub(input)
    {
        if(input.arr.length != this.arr.length)
        {
            throw "Addition input height mismatch";
        }
        for(let i = 0; i < this.arr.length; i++)
        {
            this.arr[i] -= input.arr[i];
        }
    }
    scale(scalar)
    {
        for(let i = 0; i < this.arr.length; i++)
        {
            this.arr[i] *= scalar
        }
    }
    transpose(out)
    {
        if(this.height != out.width || this.width!=out.height)
        {
            throw "Transpose size mismatch";
        }
        for(let y = 0; y < this.height; y++)
        {
            for(let x = 0; x < this.width; x++)
            {
                out.setItem(this.getItem(x,y),y,x);
            }
        }
        return out;
    }
    forEach(func)
    {
        for(let y = 0; y < this.height; y++)
        {
            for(let x = 0; x < this.width; x++)
            {
                let val = func(this.getItem(x,y),x,y,x+y*this.height);
                if(val != undefined)
                {
                    this.setItem(val,x,y);
                }
            }
        }
    }
    log(precision = 2)
    {
        let out = "";
        for(let y = 0; y < this.height; y++)
        {
            let line = "";
            for(let x = 0; x < this.width; x++)
            {
                line += Math.trunc(this.getItem(x,y)*10**precision)/10**precision+", "
            }
            out += line+"\n";
        }
        console.log(out)
    }
    SVD()
    {
        let sqMat;
        let U = new SquareMatrix(this.height);
        let V = new SquareMatrix(this.width);

        let M;

        let eigenVecs;

        if(this.height<this.width)
        {
            sqMat = new SquareMatrix(this.height,this.height);
            let transpose = new Matrix(this.height,this.width);
            this.transpose(transpose);
    
            this.mul(transpose,sqMat);

            eigenVecs = sqMat.getEigens(sqMat.size);
    
            for(let y = 0; y < sqMat.size; y++)
            {
                for(let x = 0; x < sqMat.size; x++)
                {
                    U.setItem(eigenVecs[x][0].arr[y],x,y);
                }
            }
            M=U;

        }
        else
        {
            sqMat = new SquareMatrix(this.width,this.width);
            let transpose = new Matrix(this.height,this.width);
            this.transpose(transpose);
    
            transpose.mul(this,sqMat);

            eigenVecs = sqMat.getEigens(sqMat.size);
    
            for(let y = 0; y < sqMat.size; y++)
            {
                for(let x = 0; x < sqMat.size; x++)
                {
                    V.setItem(eigenVecs[x][0].arr[y],x,y);
                }
            }

            M=V;
        }
        let MT = new SquareMatrix(M.size);
        M.transpose(MT);
            
        let S = new Matrix(this.width,this.height);
        let S_inv = new Matrix(this.height,this.width);

        for(let i = 0; i < Math.min(this.width,this.height); i++)
        {
            S.setItem(Math.sqrt(eigenVecs[i][1]),i,i);
            S_inv.setItem(1/Math.sqrt(eigenVecs[i][1]),i,i);
        }

        if(this.height<this.width)
        {
            let tempMat = new Matrix(this.height,this.width);
            S_inv.mul(MT,tempMat);
            tempMat.mul(this,V);
        }
        else
        {
            let tempMat = new Matrix(this.height,this.width);
            MT.mul(S_inv,tempMat);
            this.mul(tempMat,U);
        }
        
        return [U,S,V];
    }
}

class SquareMatrix extends Matrix
{
    constructor(size)
    {
        super(size,size);
    }
    clone()
    {
        let out = new SquareMatrix(this.size);
        for(let i = 0; i < out.arr.length; i++)
        {
            out.arr[i] = this.arr[i]
        }
        return out;
    }
    QRDecomposition()
    {
        let Q = new SquareMatrix(this.size);
        let R = new SquareMatrix(this.size);
        this.transpose(R);

        for(let k = 0; k < this.size; k++)
        {
            let magnitude = 0;
            for(let i = 0; i < this.size; i++)
            {
                magnitude  += R.getItem(i,k)**2;
            }
            magnitude = Math.sqrt(magnitude);

            for(let i = 0; i < this.size; i++)
            {
                R.setItem(R.getItem(i,k) / magnitude,i,k);
            }

            for(let row = k+1; row < this.size; row++)
            {
                let dotProduct = 0;
                for(let i = 0; i < this.size; i++)
                {
                    dotProduct += R.getItem(i,k)*R.getItem(i,row);
                }

                for(let i = 0; i < this.size; i++)
                {
                    let val = R.getItem(i,row)-R.getItem(i,k)*dotProduct;
                    R.setItem(val,i,row);
                }
            }
        }
        R.transpose(Q);
        R.mul(this,R);

        return [Q,R];
    }
    givensEigen()
    {
        for(let y = 1; y < this.size; y++)
        {
            for(let x = 0; x < y; x++)
            {
                let xx = this.getItem(x,x);
                let yy = this.getItem(y,y);
                let xy = this.getItem(x,y);

                let eigenVal = (xx+yy)*0.5 + Math.sqrt(((xx+yy)**2-4*(xx*yy-xy*xy)))*0.5;

                let eigenVec;
                if(Math.abs(xx - eigenVal)>Math.abs(yy - eigenVal))
                {
                    eigenVec = [xx-eigenVal,xy];
                }
                else
                {
                    eigenVec = [xy,yy-eigenVal];
                }
                

            }
        }
    }

    getLargestEigen(precision = 0.001)
    {
        let v = new Vector(this.size);
        let pV = new Vector(this.size);
        for(let i = 0; i < this.size; i++)
        {
            v.setItem(Math.random()*2-1,0,i);
        }

        let error = Infinity
        let n = 0;

        let norm = 0;
        let value = 0;

        for(let i = 0; i < 10000 && error > precision; i++)
        {
            this.mul(v,v);

            norm = v.norm();

            value = 0;
            for(let j = 0; j < this.size; j++)
            {
                value += v.arr[j] * pV.arr[j];
            }

            v.scale(1/norm);
            

            pV.sub(v);

            error = pV.norm()
            // pV.log();
            // console.log(error)
            v.copyTo(pV);
            n++
        }
        // console.log(value,norm)
        if(v.arr[0] < 0)
        {
            v.scale(-1)
        }
        // console.log(n)
        return [v,value];
    }
    getEigens(count)
    {
        let vectors = [];
        for(let i = 0; i < count; i++)
        {
            let v = this.getLargestEigen();
            vectors.push(v);

            for(let x = 0; x < this.size; x++)
            {
                let dot = 0;
                for(let y = 0; y < this.size; y++)
                {
                    dot += this.getItem(x,y)*v[0].arr[y];
                }
                for(let y = 0; y < this.size; y++)
                {
                    let newVal = this.getItem(x,y) - v[0].arr[y]*dot;
                    this.setItem(newVal,x,y);
                }
                
                let testDot = 0;
                for(let y = 0; y < this.size; y++)
                {
                    testDot += this.getItem(x,y)*v[0].arr[y];
                }
            }
        }

        return vectors;
    }
    identity()
    {
        for(let y = 0; y < this.size; y++)
        {
            for(let x = 0; x < this.size; x++)
            {
                if(x == y)
                {   
                    this.setItem(1,x,y);
                }
                else
                {
                    this.setItem(0,x,y);
                }
            }   
        }
    }

    QREigenvectors()
    {   
        let q_total = new SquareMatrix(this.size);
        let r_total = new SquareMatrix(this.size);

        q_total.identity();
        r_total.identity();


        let updated = this.clone();

        for(let i = 0; i < 100; i++)
        {
            let QR = updated.QRDecomposition();
            let q = QR[0];
            let r = QR[1];
            updated.log(5);

            q_total.mul(q,q_total);
            r_total.mul(r,r_total);
            
            r.mul(q,updated);
        }

        updated.log();
        q_total.log();
    }
    get size()
    {
        return this.height;
    }
    set size(val)
    {
        // this.width = val;
        // this.height = val;
    }
    
}
class Vector extends Matrix
{
    constructor(size)
    {
        super(1,size);
    }
    get size()
    {
        return this.height;
    }
    set size(val)
    {
        // this.height = val;
    }
    clone()
    {
        let out = new Vector(this.size);
        for(let i = 0; i < out.arr.length; i++)
        {
            out.arr[i] = this.arr[i]
        }
        return out;
    }
    /**
     * 
     * @param {Vector} input 
     * @param {Matrix} output 
     */
    tableMul(input,output)
    {
        if(this.size != output.width)
        {
            throw "Table output size mismatch"
        }
        if(input.size != output.height)
        {
            throw "Table input size mismatch"
        }

        for(let y = 0; y < output.height; y++)
        {
            for(let x = 0; x < output.width; x++)
            {
                output.arr[x+y*output.width] = this.arr[x] * input.arr[y];
            }
        }
    }
    norm()
    {
        let out = 0;
        for(let i = 0; i < this.size; i++)
        {
            out+=this.arr[i]**2;
        }
        return Math.sqrt(out);
    }
}
