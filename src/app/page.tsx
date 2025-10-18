"use client";

import { useState } from "react";

type Product = {
  code?: string;
  name?: string;
  price?: number;
};

export default function Home() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product>({});
  const [purchaseList, setPurchaseList] = useState<Product[]>([]);
  const handleReadCode = async () => {
    try {
      const res = await fetch(`https://app-002-gen10-step3-1-py-oshima22.azurewebsites.net/api/product?code=${barcode}`);
  const data = await res.json(); setProduct(data); }

  catch (error) { console.error("APIエラー:", error);
    setProduct({ code: barcode, name: "通信エラー", price: 0 }); } };
  const handleAdd = () => { if (product.name && product.price !== undefined) { setPurchaseList([...purchaseList, product]); } };
  const [showPopup, setShowPopup] = useState(false); //合計金額の計算
  // const total = purchaseList.reduce((sum, p) => sum + (p.price || 0), 0); //購入ボタン押下時の処理
  const total = purchaseList.reduce((sum, p) => sum + Math.floor((p.price || 0) * 1.1), 0);
  const handlePurchase = async () => { if (purchaseList.length > 0) {
    try {
      await fetch("https://app-002-gen10-step3-1-py-oshima22.azurewebsites.net/api/purchase",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(purchaseList), });
        setShowPopup(true); } catch (error) { console.error("購入登録エラー:", error);} } };
  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState<Product[]>([]);
  const handleShowHistory = async () => {
  try {
    const res = await fetch("https://app-002-gen10-step3-1-py-oshima22.azurewebsites.net/api/history");
    const data = await res.json();
    setHistoryList(data);
    setShowHistory(true);
  } catch (error) {
    console.error("履歴取得エラー:", error);
  }
};

return ( <div className="mx-auto px-4 max-w-xl">

  {/* 入力フォーム */}
<section className="mt-8 border bg-white p-4 rounded-xl shadow relative">
  <button
    onClick={handleShowHistory}
    className="absolute top-2 right-2 bg-gray-500 text-white px-3 py-1 rounded text-sm"
  >
    履歴表示
  </button>
  <h2 className="mb-4 text-lg font-bold text-gray-500">入力フォーム</h2>
    <label className="block mb-2 text-sm font-bold text-gray-700">商品コード</label>
    <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="商品コードを入力" className="w-full p-2 border rounded" />
    <div className="mt-4 flex justify-center gap-2">
      <button onClick={handleReadCode} className="bg-blue-500 text-white px-4 py-2 rounded">商品コード読み込み</button>
      <button onClick={() => {
    setBarcode("");       // 商品コードをクリア
    setProduct({});       // 商品情報（商品名・単価）をクリア
  }}
  className="bg-gray-300 text-black px-4 py-2 rounded">削除</button>
      {/* <button onClick={() => setBarcode("")} className="bg-gray-300 text-black px-4 py-2 rounded">削除</button> */}
      </div> </section>

  {/* 商品情報 */}
  <section className="mt-8 border bg-white p-4 rounded-xl shadow">
    <h2 className="mb-4 text-lg font-bold text-gray-500">商品情報</h2>
    <label className="block text-sm font-bold text-gray-700">商品名</label>
    <div className="p-2 border rounded h-10">{product.name || "商品名を表示"}</div>
    <label className="block mt-2 text-sm font-bold text-gray-700">単価（税抜）</label>
    <div className="p-2 border rounded h-10">{product.price !== undefined ? `¥${product.price}` : "単価（税抜）を表示"}</div>
    <div className="mt-4 flex justify-center">
      <button onClick={handleAdd} className="mt-4 bg-green-500 text-white px-4 py-2 min-w-[240px] rounded">追加</button></div>
  </section>

  {/* 購入リスト */}
  <section className="mt-8 border bg-white p-4 rounded-xl shadow">
    <h2 className="mb-4 text-lg font-bold text-gray-500">購入リスト</h2>
    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-2 py-1">商品名</th>
          <th className="border px-2 py-1">個数</th>
          <th className="border px-2 py-1">単価（税抜）</th>
          <th className="border px-2 py-1">金額（税抜）</th>
        </tr>
      </thead>
      <tbody>
        {purchaseList.map((item, i) => (
          <tr key={i}>
            <td className="border px-2 py-1">{item.name}</td>
            <td className="border px-2 py-1">1</td>
            <td className="border px-2 py-1">¥{item.price}</td>
            <td className="border px-2 py-1">¥{item.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mt-4 flex justify-center">
      <button onClick={handlePurchase} className="mt-4 bg-red-500 text-white px-4 py-2 min-w-[240px] rounded">購入</button></div>
      {/* ポップアップ */}
  {showPopup && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
        <h2 className="text-xl font-bold mb-4">合計金額（税込）</h2>
        <p className="text-2xl text-green-600 font-semibold">¥{total}</p>
        <button
          onClick={() => {
            setShowPopup(false);         // ポップアップを閉じる
            setPurchaseList([]);         // 購入リストをクリア
            setBarcode("");              // 商品コード入力欄をクリア
            setProduct({});              // 商品情報をクリア
          }}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
        >
          OK
        </button>
      </div>
    </div>
  )}
  {/* 購入履歴のポップアップ表示 */}
{showHistory && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[90%] max-w-2xl">
      <h2 className="text-xl font-bold mb-4">購入履歴</h2>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">商品名</th>
            <th className="border px-2 py-1">金額</th>
            <th className="border px-2 py-1">購入日時</th>
          </tr>
        </thead>
        <tbody>
          {historyList.map((item, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1">¥{item.price}</td>
              <td className="border px-2 py-1">{item.purchased_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => setShowHistory(false)}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        閉じる
      </button>
    </div>
  </div>
)}
  </section>
</div>

); }
