import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Tile from './tile';
import Omit from './omit';
import Words from './words';

function App() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [{answers, sorted, possibleAnswers}, setWordleState] = useState({ answers: [], occurrences: {}, rankings: {}, sorted: [], possibleAnswers: []})
  const [correct1, setCorrect1] = useState('');
  const [correct2, setCorrect2] = useState('');
  const [correct3, setCorrect3] = useState('');
  const [correct4, setCorrect4] = useState('');
  const [correct5, setCorrect5] = useState('');
  const [contains1, setContains1] = useState('');
  const [contains2, setContains2] = useState('');
  const [contains3, setContains3] = useState('');
  const [contains4, setContains4] = useState('');
  const [contains5, setContains5] = useState('');
  const [omit, setOmit] = useState('');


  useEffect(() => {
    if (sorted.length === 0) {
      return;
    }
    const possibleAnswers = sorted.filter((answer) => {
      return answer[0].includes(correct1) &&
      answer[1].includes(correct2) &&
      answer[2].includes(correct3) &&
      answer[3].includes(correct4) &&
      answer[4].includes(correct5) &&
      [...omit].every(omitted => !answer.includes(omitted)) &&
      (!contains1.includes(answer[0]) && [...contains1].every(contain => answer.includes(contain))) &&
      (!contains2.includes(answer[1]) && [...contains2].every(contain => answer.includes(contain))) &&
      (!contains3.includes(answer[2]) && [...contains3].every(contain => answer.includes(contain))) &&
      (!contains4.includes(answer[3]) && [...contains4].every(contain => answer.includes(contain))) &&
      (!contains5.includes(answer[4]) && [...contains5].every(contain => answer.includes(contain)))
    });
    setWordleState((curr) => ({...curr, possibleAnswers}));
  }, [sorted, correct1, correct2, correct3, correct4, correct5, contains1, contains2, contains3, contains4, contains5, omit])
  
  useEffect(() => {
    const data = searchParams.get('data');
    if (!data) {
      setSearchParams({})
      return
    }

    try {
      const answers = atob(data).split(',');
    setAnswers(answers.filter(word => word.length===5));
    } catch {
      setSearchParams({})
    }
    

  }, [searchParams,setSearchParams])

  const setAnswers = (answers) => {
    setLoading(true);
    try {
      const occurrences = {};
      answers.forEach(answer => {
        [...answer].forEach(letter => {
          if (typeof occurrences[letter] !== 'undefined' ) {
            occurrences[letter] = occurrences[letter]+1;
            return
          }
          occurrences[letter] = 0;
        })
      });
    
      const rankings = answers.reduce((res, cur) => {
        let ranking = 0;
        let str = [...cur];
        str = new Set(str);      
        str.forEach((ltr) => ranking += occurrences[ltr])
    
        return {[cur]: ranking, ...res};
      }, {});
    
      const sorted = [...answers].sort((a, b) => {
        return rankings[b] - rankings[a];
      });
      setWordleState({ answers, occurrences, rankings, sorted, possibleAnswers: []});
    } catch {}
    finally {
      setLoading(false)
    }
    
  };

  const onUpdate = (answers) => {
    setSearchParams({data: btoa(answers)})
  }

  const clearState = () => {
    setCorrect1('');
    setCorrect2('');
    setCorrect3('');
    setCorrect4('');
    setCorrect5('');
    setContains1('');
    setContains2('');
    setContains3('');
    setContains4('');
    setContains5('');
    setOmit('');
  }

  return (
    <div style={{display:'flex', flexDirection: 'column', alignItems: 'center'}} >
      <h1>Wordle solver</h1>
      <div>
        <Tile value={correct1} type="correct" onChange={setCorrect1}/>
        <Tile value={correct2} type="correct" onChange={setCorrect2}/>
        <Tile value={correct3} type="correct" onChange={setCorrect3}/>
        <Tile value={correct4} type="correct" onChange={setCorrect4}/>
        <Tile value={correct5} type="correct" onChange={setCorrect5}/>
      </div>
      <div>
        <Tile value={contains1} onChange={setContains1} />
        <Tile value={contains2} onChange={setContains2} />
        <Tile value={contains3} onChange={setContains3} />
        <Tile value={contains4} onChange={setContains4} />
        <Tile value={contains5} onChange={setContains5} />
      </div>
      <div><Omit value={omit} onChange={setOmit}/></div>
      <button style={{width: '505px'}} onClick={clearState}>clear</button>
      <h2>BEST GUESS:</h2>
      <div>{possibleAnswers.length > 0 && possibleAnswers[0]}</div>
        <h2>POSSIBLE ANSWERS ({possibleAnswers.length}):</h2>
        {possibleAnswers && possibleAnswers.map((poss) => <div key={poss}>{poss}</div>)}
      <Words onSubmit={onUpdate} disabled={loading} defaultValue={answers.join(',')}/>
    </div>
  );
}

export default App;
