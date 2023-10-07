import React, { useState, useEffect } from 'react';
import {createRoot} from 'react-dom/client';
import {Button} from 'antd';
import './index.css';

function App() {
  const [Name, setName] = useState('');
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    const savedDatas = JSON.parse(localStorage.getItem('datas')) || [];
    setDatas(savedDatas);
  }, []);
  
  //添加队伍
  const NewTeam = () => {
    if (Name === '') {
      alert('请输入队伍名称！');
    } else{
      const new_data = {
        name: Name,
        score: 0,
      };
      setDatas(prevDatas => [...prevDatas, new_data]);
      localStorage.setItem('datas', JSON.stringify([...datas, new_data]));
      setName('');
    }
  };

  //淘汰队伍
  const Delete = i => {
    setDatas(prevDatas => {
      const newDatas = [...prevDatas];
      newDatas.splice(i, 1);
      localStorage.setItem('datas', JSON.stringify(newDatas));
      return newDatas;
    });
  };

  //加分
  const Add = i => {
    setDatas(prevDatas => {
      const newDatas = [...prevDatas];
      newDatas[i].score++;
      //重新排序
      newDatas.sort((a, b) => b.score - a.score);
      localStorage.setItem('datas', JSON.stringify(newDatas));
      return newDatas;
    });
  };

  //减分
  const Minus = i => {
    setDatas(prevDatas => {
      const newDatas = [...prevDatas];
      newDatas[i].score--;
      //重新排序
      newDatas.sort((a, b) => b.score - a.score);
      localStorage.setItem('datas', JSON.stringify(newDatas));
      return newDatas;
    });
  };

  //HTML渲染网页
  return (
    <>
      <h1 className="title" 
        onClick={()=>{
          localStorage.clear();
          setDatas([]);
        }
      }>Welcome to the Game!</h1>
      <div className="content">

        <div className="list">
          {datas.map((data, i) => (
            <div className="item" key={i}>
              <div className="name">{i+1}. {data.name}</div>
              <div className="score">{data.score}</div>
              <div className="buttons">
                <Button type="primary" onClick={() => Add(i)}>+</Button>
                <Button type="primary" onClick={() => Minus(i)}>-</Button>
                <Button type="default" onClick={() => Delete(i)}>淘汰</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="New">
            <textarea
              className="input"
              type="text"
              placeholder="请输入队伍名称"
              value={Name}
              onChange={e => setName(e.target.value)}
            ></textarea>
            <Button className="newbtn" type="primary" onClick={NewTeam}>添加队伍</Button>
        </div>
        
      </div>
    </>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
