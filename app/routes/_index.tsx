'use client'

import type { MetaFunction } from "@remix-run/node";
import { FC, createContext, useEffect, useState } from "react";
import { Content } from "server/src";
import { Socket, io } from 'socket.io-client'

export const meta: MetaFunction = () => {
  return [
    { title: "Let's Share" },
    { name: "description", content: "Shibal!" },
  ];
};

const GlobalContext = createContext<any>({})

const resizeRange = 10

export default function Index() {
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [socketAddr, setSocketAddr] = useState<string>('')
  const [connecting, setConnecting] = useState<boolean>(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [hydra, setHydra] = useState<boolean>(false)
  const [page, setPage] = useState<string>('main')
  const [left, setLeft] = useState<number>(20)
  const [right, setRight] = useState<number>(20)
  const [contents, setContents] = useState<Content[]>([])

  useEffect(() => {
    setHydra(true)
    const change = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    change()

    window.addEventListener('resize', change)
    return () => {
      window.removeEventListener('resize', change)
    }
  }, [])
  
  useEffect(() => {
    const mousedown = (e: MouseEvent) => {
    }
    const mousemove = (e: MouseEvent) => {
      // document.body.style.cursor = 'default'
    }
    const moouseup = (e: MouseEvent) => {
    }
    
    window.addEventListener('mousedown', mousedown)
    window.addEventListener('mousemove', mousemove)
    window.addEventListener('mouseup', moouseup)
    
    return () => {
      window.removeEventListener('mousedown', mousedown)
      window.removeEventListener('mousemove', mousemove)
      window.removeEventListener('mouseup', moouseup)
    }
  }, [width, height, left, right])

  const makeBackBtn = (_page:string) => {
    return <button className="backBtn" onClick={e => setPage(_page)}>뒤로가기</button>
  }

  return (hydra && <GlobalContext.Provider value={{}}>
    {page === 'main' ?
    <div className="main">
      <div className="opts">
        <button onClick={e => setPage('server')}>서버 연결</button>
        <button onClick={e => setPage('html_maker')}>HTML 메이커</button>
      </div>
    </div>:
    page === 'server' ?
    <div className="server">
      <div className="opts">
        {makeBackBtn('main')}
        <input type="text" name="" id="" value={socketAddr} onChange={e => setSocketAddr(e.target.value)} placeholder="서버 주소를 입력하세요."/>
        <button disabled={connecting} onClick={e => {
          setConnecting(true)
          const socket = io(socketAddr)
          socket.on('connect', () => {
            setSocket(socket)
            setPage('in_server')
            socket.off('connect')
            socket.off('connect_error')
            socket.on('getContents', (data: Content[]) => {
              setContents(data)
            })
            socket.emit('getContents')
            setConnecting(false)
          })
          socket.on('connect_error', () => {
            socket.off('connect')
            socket.off('connect_error')
            socket.disconnect()
            socket.close()
            setConnecting(false)
            alert('서버 연결에 실패했습니다.')
          })
        }}>{connecting ? "연결중 . . ." : "서버 연결"}</button>
      </div>
    </div>:
    page === 'in_server' ?
    <div className="in_server">
      <button className="createBtn" onClick={e => setPage('make_content')}>+</button>
      <div className="container">
        {contents.map((v, i) => (
          <div key={i} className="content">
          <div className="title">{v.title}</div>
          <div className="desc">{`()`}</div>
        </div>))}
      </div>
      <button className="backBtn" onClick={e => {
        socket?.disconnect()
        socket?.close()
        socket?.off('getContents')
        setSocket(null)
        setPage('main')
      }}>뒤로가기</button>
    </div>:
    page === 'html_maker' ?
    <div className="html_maker">
      <div className="base" style={{width:`${left}%`}}></div>
      <div className="editor" style={{width:`${100-left-right}%`}}></div>
      <div className="option" style={{width:`${right}%`}}></div>
      {makeBackBtn('main')}
    </div>:
    page === 'make_content' ? 
    <div className="make_content">
      {makeBackBtn('in_server')}
    </div>:
    <></>
    }
  </GlobalContext.Provider>
  );
}
