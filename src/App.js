import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Tile from './tile';
import Omit from './omit';
import Words from './words';

function App() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [defaultValue, setDefaultValue] = useState('');
  const [{ answers, possibleAnswers}, setWordleState] = useState({ answers: [], occurrences: {}, rankings: {}, possibleAnswers: []})
  const [showMore, setShowMore] = useState(false);
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
    try {
      const possibleAnswers = answers.filter((answer) => {
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
      const occurrences = {};
      const positions = {};
      possibleAnswers.forEach(answer => {
        [...answer].forEach(letter => {
          if (typeof occurrences[letter] !== 'undefined' ) {
            occurrences[letter] = occurrences[letter]+1;
            return
          }
          occurrences[letter] = 0;
        })
      });

      possibleAnswers.forEach(answer => {
        [...answer].forEach((letter, position) => {
          if (positions[letter] === undefined) {
            positions[letter] = {
              [position]: 0,
            }
            return;
          } else if (positions[letter][position] === undefined) {
            positions[letter][position] = 0;
          } else {
            positions[letter][position] = positions[letter][position] + 1;
          }
        })
      });
    
      const rankings = possibleAnswers.reduce((res, cur) => {
        let ranking = 0;
        const str = [...cur];
        const uniq = new Set(str);
        uniq.forEach((ltr) => ranking += occurrences[ltr])
    
        return {[cur]: ranking, ...res};
      }, {});
    
      possibleAnswers.sort((a, b) => {
        if (rankings[a] !== rankings[b]) {
          return rankings[b] - rankings[a];
        }

        let tiebrakerA = 0;
        [...a].forEach((ltr, position) => tiebrakerA += positions[ltr][position])

        let tiebrakerB = 0;
        [...b].forEach((ltr, position) => tiebrakerB += positions[ltr][position])

        return tiebrakerB - tiebrakerA;
        
      });
      setWordleState((curr) => ({ ...curr, possibleAnswers, occurrences, rankings}));
    } catch (e){console.log(e)}
    
  }, [answers, correct1, correct2, correct3, correct4, correct5, contains1, contains2, contains3, contains4, contains5, omit])
  
  useEffect(() => {
    const data = searchParams.get('data');
    if (!data) {
      setSearchParams({})
      return
    }

    try {
      setDefaultValue(data);
      const answers = atob(data).split(',').filter(word => word.length===5);
      setDefaultValue(answers.join(','));
      setWordleState(curr => ({...curr, answers}))
    } catch {
      setSearchParams({})
    }
    

  }, [searchParams,setSearchParams])

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

  const possibleAnswersDisplay = showMore ? possibleAnswers : possibleAnswers.slice(0,9);

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
        {possibleAnswersDisplay.map((poss) => <div key={poss}>{poss}</div>)}
        <button style={{width: '100px'}}  onClick={() => setShowMore(!showMore)} >show {showMore ? 'less' : 'more'}</button>
      <Words onSubmit={onUpdate} defaultValue={defaultValue}/>
    </div>
  );
}

export default App;