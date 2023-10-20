'use client'

import type { MetaFunction } from "@remix-run/node";
import { FC, createContext, useEffect, useState } from "react";
import { Socket, io } from 'socket.io-client'

export const meta: MetaFunction = () => {
  return [
    { title: "Code Helper" },
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
        <button className="backBtn" onClick={e => setPage('main')}>뒤로가기</button>
        <input type="text" name="" id="" value={socketAddr} onChange={e => setSocketAddr(e.target.value)} placeholder="서버 주소를 입력하세요."/>
        <button disabled={connecting} onClick={e => {
          setConnecting(true)
          const socket = io(socketAddr)
          socket.on('connect', () => {
            setSocket(socket)
            setPage('in_server')
            socket.off('connect')
            socket.off('connect_error')
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
    </div>:
    page === 'html_maker' ?
    <div className="html_maker">
      <div className="base" style={{width:`${left}%`}}></div>
      <div className="editor" style={{width:`${100-left-right}%`}}></div>
      <div className="option" style={{width:`${right}%`}}></div>
      <button className="backBtn" onClick={e => setPage('main')}>뒤로가기</button>
    </div>:
    <></>
    }
  </GlobalContext.Provider>
  );
}
