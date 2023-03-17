import { Vector3 } from "three"

export class Param {
    TYPES = ['integer', 'float', 'vector', 'string', 'callback']
    NUMBER_TYPES = ['integer', 'float']
    /**
     *
     * @param {String} desc - name of the param
     * @param {Any} defaultValue - we try to guess the type based on this.
     * @param {Number} [step = 1]
     * @param {Number} [min] - default: 0
     * @param {Number} [max]
     * @param {Number} [multiplier = 1]
     */
    constructor(desc, defaultValue, step, min, max, multiplier, onChange) {
        this.desc = desc
        this.min = min
        this.max = max
        this.step = step || 1
        this.multiplier = multiplier || 1
        this.value = defaultValue
        this.onChange = onChange
        if (defaultValue) {
            switch (typeof defaultValue) {
                case 'number': this.type = (step === 1) ? 'integer' : 'float'; break
                case 'string': this.type = 'string'; break
                case 'boolean': this.type = 'boolean'; break
                default:
                    if (defaultValue instanceof Vector3) {
                        this.type = 'vector'
                    } else {
                        this.type = typeof defaultValue;
                    }
                // case 'action': this.value = ()=>{console.warn('not hooked up')}
            }
        }
        if (this.NUMBER_TYPES.includes(this.type)){
            if (this.min === undefined || this.max === undefined){
                console.warn('Number types should have limited values!', this.desc, this.value)
            }
        }
    }

    /**
     * @param {Number} value - normal value
     */
    changeNormal(value) {
        const oldValue = this.value
        if (this.NUMBER_TYPES.includes(this.type)) {
            const range = this.max - this.min
            this.value = this.min + (range * value)

            if (this.type === 'integer'){
                this.value = Math.round(this.value)
            }
        } else if (this.type === 'vector') {
            // DUMMY
            this.value.y = value
        }

        if (this.onChange) {
            this.onChange(this.value, oldValue)
        }
    }

    toString(){
        switch(this.type){
            case 'integer': return Math.round(this.value)
            case 'float': return (this.value).toLocaleString(undefined, {minimumFractionDigits: 3})
            case 'vector': return `(${this.value.x}, ${this.value.y}, ${this.value.z})`
            default: return this.value
        }
    }
}