import { useState } from "react";


export default function Words({onSubmit, disabled}) {

    const  [value, setValue] = useState('');
    const handleChange = (e) => {
        const value = e.target.value.toUpperCase();
        let str = value.replace(/(?:\r\n|\r|\n|\s)/g,'').toUpperCase().split(',');
         // Create a set using array
         str = new Set(str);
         str = [...str].join(',')
         setValue(str);
    }
    return (
      <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center'}}>
        <h2>DATA:</h2>
        <textarea onChange={handleChange} type="text" value={value} style={{width: '500px', minHeight: '250px'}} />
        <button style={{width: '500px'}}  onClick={() => onSubmit(value.split(','))} disabled={disabled}>update</button>
      </div>
    );
};