import React, { useState, useEffect } from 'react';
import {createRoot} from 'react-dom/client';
import {Button} from 'antd';
import './rank.css';
import axios from 'axios';
import JSON from 'JSON';

function App() {
  const [Name, setName] = useState('');
  const [datas, setDatas] = useState([]);

  function UpdateDatabase(datas){
    //更新数据库
    console.log(datas);
    axios.post('http://121.40.96.147:8080', JSON.stringify(datas))
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    //读取数据库
    axios.get('http://121.40.96.147:8080')
      .then((res) => {
        console.log(res);
        const savedDatas = res.data;
        savedDatas.sort((a, b) => b.Score - a.Score);
        console.log(savedDatas)
        setDatas(savedDatas);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  
  //添加队伍
  const NewTeam = () => {
    if (Name === '') {
      alert('请输入队伍名称！');
    } else{
      const new_data = {
        Name: Name,
        Score: 0,
      };
      setDatas(prevDatas => [...prevDatas, new_data]);
      UpdateDatabase([...datas, new_data]);
      setName('');
    }
  };

  //淘汰队伍
  const Delete = i => {
    setDatas(prevDatas => {
      const newDatas = [...prevDatas];
      newDatas.splice(i, 1);
      UpdateDatabase(newDatas);
      return newDatas;
    });
  };

  //加分
  const Add = i => {
    setDatas(prevDatas => {
      const newDatas = [...prevDatas];
      newDatas[i].Score++;
      //重新排序
      newDatas.sort((a, b) => b.Score - a.Score);
      UpdateDatabase(newDatas);
      return newDatas;
    });
  };

  //减分
  const Minus = i => {
    setDatas(prevDatas => {
      const newDatas = [...prevDatas];
      newDatas[i].Score--;
      //重新排序
      newDatas.sort((a, b) => b.Score - a.Score);
      UpdateDatabase(newDatas);
      return newDatas;
    });
  };

  //HTML渲染网页
  return (
    <>
      <h1 className="title" 
        onClick={()=>{
          setDatas([]);
          UpdateDatabase([]);
        }
      }>Welcome to the Game!</h1>
      <div className="content">

        <div className="list">
          {datas.map((data, i) => (
            <div className="item" key={i}>
              <div className="name">{i+1}. {data.Name}</div>
              <div className="score">{data.Score}</div>
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
