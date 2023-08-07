

export default function Omit({value, onChange}) {

    const handleChange = (e) => {
        const value = e.target.value.toUpperCase();
        let str = [...value];
         // Create a set using array
         str = new Set(str);
         onChange([...str].join(''))
    }
    return <input onChange={handleChange} type="text" value={value} style={{height: '80px', width: '500px', textAlign: 'center', fontSize: '48px', margin: '10px', border: 'none', color: 'white', fontWeight:'bold', background: '#3a3a3c'}} />
};