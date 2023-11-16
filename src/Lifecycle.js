import React, {useState, useEffect} from "react";

const UnmountTest = () => {
  useEffect(() => {
    console.log("mount");
    return () => {
      //unmount
      console.log("unmount");
    }
  }, []);
  return (
    <div>
      Unmounting testing component
    </div>
  );
}

const Lifecycle = () => {
  // const [count, setCount] = useState(0);
  // const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => setIsVisible(!isVisible);
  // useEffect(() => {
  //   console.log("mount");
  // },[]);
  // useEffect(() => {
  //   console.log("update");
  // })
  // useEffect(() => {
  //   console.log(`Count is updated to ${count}`);
  //   if(count > 5) {
  //     alert("count가 5를 넘었습니다 1로 초기화합니다");
  //     setCount(1);
  //   }
  // }, [count])
  // useEffect(() => {
  //   console.log(`text is updated to ${text}`);
  // }, [text]);
  return (
    <div style={{padding:20}}>
     <button onClick={toggle}>on off</button>
     {isVisible && <UnmountTest />}

     {/* <div>
        {count}
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      </div> */}
    </div>
  );
  
}

export default Lifecycle;