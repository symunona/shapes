/**
 * A cube, a pot, a tree,
 * let your mind be free.
 */
export class Fiddle {
    /**
     * @type {String}
     */
    name
    /**
     * @type {Inputs} that's keys describe params
     */
    inputs

    /**
     * @type {Object[string]:Param} keys describe variables that come out of this
     */
    OUTPUTS

    build(scene, params){}
}


export class Inputs{
    /**
     * @param {Object.<string, Param>} params
     */
    constructor(params){
        // So they are directly reachable from top level
        Object.assign(this, params)
        this.params = params
    }
    /**
     * @param {Number} i
     */
    getByIndex(i){
        const paramKeys = Object.keys(this.params)
        const paramKey = paramKeys[i]
        return this.params[paramKey]
    }
    toString(){
        return Object.keys(this.params).map(
            (paramKey)=>paramKey + ': ' + this.params[paramKey].toString())
            .join('\n')
    }
}