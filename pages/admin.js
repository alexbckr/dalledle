import Head from "next/head"
import { useState } from "react"

export default function Admin() {
   const [caption, setCaption] = useState("")
   const [url, setUrl] = useState("")
   const [status, setStatus] = useState("")

   const handleSubmit = async (e) => {
      e.preventDefault()
      const res = await fetch("/api/admin/add", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ caption, url })
      })
      if (res.ok) {
         setStatus("Added successfully!")
         setCaption("")
         setUrl("")
      } else {
         setStatus("Failed to add.")
      }
   }

   return (
      <>
         <Head>
            <title>Admin - DALL-Edle</title>
         </Head>
         <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
            <h1>Add New Image</h1>
            <form onSubmit={handleSubmit}>
               <div style={{ marginBottom: "1rem" }}>
                  <label>Caption:</label><br />
                  <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
               </div>
               <div style={{ marginBottom: "1rem" }}>
                  <label>Image URL:</label><br />
                  <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
               </div>
               <button type="submit" style={{ padding: "0.5rem 1rem" }}>Upload</button>
            </form>
            {status && <p>{status}</p>}
         </div>
      </>
   )
}
