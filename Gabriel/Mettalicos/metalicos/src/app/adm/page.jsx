"use client"
import 'bootstrap/dist/css/bootstrap.min.css'


import './adm.css'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Adm() {
  const router = useRouter()
  const AUTH = 'newjeans'

  const LIST_TRY = ['http://localhost:3001/adm', 'http://localhost:3001/']
  const POST_URL  = 'http://localhost:3001/adm'
  const PUT_URL   = (id) => `http://localhost:3001/adm/${id}`
  const DEL_URL   = (id) => `http://localhost:3001/adm/${id}`
  const DEL_FALL  = (id) => `http://localhost:3001/remove/${id}`

  const [listUrl, setListUrl] = useState(LIST_TRY[0]) 
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

 
  const [novo, setNovo] = useState({
    nome: '', descricao: '', preco: '', img: '', categoria: '', medida: '',
  })

  const [editarId, setEditarId] = useState('')
  const [editar, setEditar] = useState({ nome:'', descricao:'', preco:'', img:'', categoria:'', medida:'' })
  const [removerId, setRemoverId] = useState('')

  const campos = useMemo(() => (['nome','descricao','preco','img','categoria','medida']), [])


  const fetchProdutos = async () => {
    setLoading(true)
    setMsg('')
    for (const urlTry of LIST_TRY) {
      try {
        const res = await fetch(urlTry, { headers: { Authorization: AUTH }, cache: 'no-store' })
        if (!res.ok) throw new Error(`GET falhou em ${urlTry} (${res.status})`)
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('Resposta não é um array')
        setProdutos(data)
        setListUrl(urlTry)
        setLoading(false)
        return
      } catch (e) {

      }
    }
    setLoading(false)
    setMsg('Erro ao carregar produtos (verifique rota GET e CORS)')
    setProdutos([])
  }

  useEffect(() => { fetchProdutos() }, [])

  const criar = async () => {
    setMsg('')
    try {
      const res = await fetch(POST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: AUTH },
        body: JSON.stringify(novo),
      })
      if (!res.ok) throw new Error('Falha ao criar')
      setMsg('Produto criado!')
      setNovo({ nome:'', descricao:'', preco:'', img:'', categoria:'', medida:'' })
      await fetchProdutos()
    } catch (e) {
      console.error(e)
      setMsg('Erro ao criar')
    }
  }

  const salvarEdicao = async (p) => {
    setMsg('')
    try {
      const res = await fetch(PUT_URL(p.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: AUTH },
        body: JSON.stringify({
          nome: p.nome, descricao: p.descricao, preco: p.preco,
          img: p.img, categoria: p.categoria, medida: p.medida,
        }),
      })
      if (!res.ok) throw new Error('Falha ao salvar')
      setMsg(`Produto ${p.id} atualizado!`)
      await fetchProdutos()
    } catch (e) {
      console.error(e)
      setMsg('Erro ao salvar alterações')
    }
  }

  const excluir = async (id) => {
    if (!confirm(`Excluir produto ${id}?`)) return
    setMsg('')
    try {
      let res = await fetch(DEL_URL(id), { method: 'DELETE', headers: { Authorization: AUTH } })
      if (!res.ok) {
        res = await fetch(DEL_FALL(id), { method: 'DELETE', headers: { Authorization: AUTH } })
      }
      if (!res.ok) throw new Error('Falha ao excluir')
      setMsg(`Produto ${id} removido`)
      setProdutos(prev => prev.filter(x => x.id !== id))
    } catch (e) {
      console.error(e)
      setMsg('Erro ao excluir')
    }
  }

  const changeCell = (id, campo, valor) => {
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, [campo]: valor } : p))
  }

  const editarSemLista = async () => {
    if (!editarId) { setMsg('Informe um ID para alterar'); return }
    await salvarEdicao({ id: editarId, ...editar })
  }

  const removerSemLista = async () => {
    if (!removerId) { setMsg('Informe um ID para remover'); return }
    await excluir(removerId)
  }

  return (
    <div className="container py-4">
      <h1>Admin • Produtos</h1>

      {msg && <p>{msg}</p>}

      <div className="mb-3 d-flex gap-2 align-items-center">
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchProdutos}>Recarregar</button>
        <small>Listando via: <code>{listUrl}</code></small>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{width: 90}}>ID</th>
                {campos.map(c => <th key={c}>{c}</th>)}
                <th style={{width: 180}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  {campos.map(c => (
                    <td key={c}>
                      <input
                        className="form-control"
                        value={p[c] ?? ''}
                        onChange={e => changeCell(p.id, c, e.target.value)}
                      />
                    </td>
                  ))}
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-primary" onClick={() => salvarEdicao(p)}>Salvar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => excluir(p.id)}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Linha de criação */}
              <tr>
                <td>novo</td>
                {campos.map(c => (
                  <td key={`novo-${c}`}>
                    <input
                      className="form-control"
                      value={novo[c]}
                      onChange={e => setNovo({ ...novo, [c]: e.target.value })}
                      placeholder={c}
                    />
                  </td>
                ))}
                <td>
                  <button className="btn btn-success btn-sm" onClick={criar}>Criar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {produtos.length === 0 && (
        <div className="mt-4">
          <h5>Operações rápidas (sem lista):</h5>
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <div className="border rounded p-3 h-100">
                <strong>Alterar por ID</strong>
                <div className="mb-2">
                  <input className="form-control" placeholder="ID" value={editarId} onChange={e => setEditarId(e.target.value)} />
                </div>
                {campos.map(c => (
                  <div className="mb-2" key={`form-${c}`}>
                    <input className="form-control" placeholder={c} value={editar[c]} onChange={e => setEditar({ ...editar, [c]: e.target.value })} />
                  </div>
                ))}
                <button className="btn btn-primary" onClick={editarSemLista}>Salvar alterações</button>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="border rounded p-3 h-100">
                <strong>Remover por ID</strong>
                <div className="mb-2">
                  <input className="form-control" placeholder="ID" value={removerId} onChange={e => setRemoverId(e.target.value)} />
                </div>
                <button className="btn btn-outline-danger" onClick={removerSemLista}>Excluir</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
