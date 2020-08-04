define(['frame', 'underscore'], (c, _)=>{

    class Gridder{
        Square = Square

        init(){

        }
    }

    class Square{
        params = ['x', 'y', 'spacing']
        defaults = { x: 10, y: 10, spacing: 10, w: c.w, h: c.h}

        draw(p, params, shape){
            let xCount = params.x, yCount = params.y
            // Mode 1: figure out x and y based on spacing.
            if (params.h && params.w){
                xCount = params.w / (params.spacing + 1)
                yCount = params.h / (params.spacing + 1)
            }

            for (let xs = 0; xs < xCount; xs++) {
                for (let ys = 0; ys < yCount; ys++) {
                    p.push()
                    let x = (xs + 0.5) * params.spacing, y = (ys + 0.5) * params.spacing
                    p.translate(x, y)

                    // Draw the actual shape.
                    shape(p, xs, ys, x, y)

                    // Restore the matrix.
                    p.pop()
                }
            }

        }
    }

    Gridder.Square = Square


    return Gridder


})