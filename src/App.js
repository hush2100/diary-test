import React, { useRef, useEffect, useMemo, useCallback, useReducer, createContext } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();

const reducer = (state, action) => {
  switch(action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data, created_date
      }
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) => it.id === action.targetId ? {...it, content:action.newContent} : it)
    }
    default: 
      return state;
    
  }
};

function App() {
  // const [data, setData] = useState([]);
  const [data, dispatch] = useReducer(reducer, []);

  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/comments")
    .then((res) => res.json());
    //console.log(res);

    const initData = res.slice(0,20).map((it) => {
      return {
        author : it.email,
        content: it.body, 
        emotion : Math.floor(Math.random() * 5) + 1,
        created_date : new Date().getTime(),
        id : dataId.current++,
      }
    });
    dispatch({type: "INIT", data:initData});
    //setData(initData);
  }

  useEffect(() => {
    getData();
  }, []);
  
  const onCreate = useCallback((author, content, emotion) => {
    // const created_date = new Date().getTime();
    // const newItem = {
    //   author, 
    //   content, 
    //   emotion,
    //   created_date,
    //   id: dataId.current
    // }
    
    dispatch({type: "CREATE", data: { author, content, emotion, id: dataId.current} })
    dataId.current += 1;
    // setData((data) => [newItem, ...data]);
  },[]);
  const onRemove = useCallback((targetId) => {
    dispatch({type: "REMOVE", targetId})
    //setData((data) => data.filter(item => item.id !== targetId));
  }, []);
  const onEdit = useCallback((targetId, newContent) => {
    dispatch({type: "EDIT", targetId, newContent})
    // setData((data) =>
    // data.map((item) => 
    //   item.id === targetId ? {...item, content: newContent} : item)
    // );
  }, []);
  const memoizedDispatch = useMemo(() => {
    return {onCreate, onRemove, onEdit};
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    if (data.length === 0) {
      return { goodcount: 0, badCount: 0, goodRatio: 0 };
    }
    //console.log("일기 분석 시작");

    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100.0;
    return { goodCount, badCount, goodRatio };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length]);
  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;
  return (
  <DiaryStateContext.Provider value={data}>
    <DiaryDispatchContext.Provider value={memoizedDispatch}>
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList />
    </div>
    </DiaryDispatchContext.Provider>
  </DiaryStateContext.Provider>
  );
}

export default App;
