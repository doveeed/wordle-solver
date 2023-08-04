

export default function Tile({value, type, onChange}) {
    const isCorrect = type === 'correct';
    const background = isCorrect ? '#538d4e':'#b59f3b'; 

    const handleChange = (e) => {
        const value = e.target.value.toUpperCase();
        let str = [...value];
         // Create a set using array
         str = new Set(str);
         onChange([...str].join(''))
    }
    return <input onChange={handleChange} type="text" value={value} maxLength={isCorrect ? 1 : 100} style={{height: '80px', width: '80px', textAlign: 'center', fontSize: '48px', margin: '10px', border: 'none', color: 'white', fontWeight:'bold', background}} />
};