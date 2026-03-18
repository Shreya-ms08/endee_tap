import os
import requests
import streamlit as st
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

st.set_page_config(page_title="Agentic RAG", layout="wide")
st.title("🧠 Agentic RAG with Endee + Gemini")
st.caption("Uploads → chunk → embed → Endee search → rerank → Gemini response")

if "messages" not in st.session_state:
    st.session_state.messages = []

# Upload section
with st.expander("Upload documents (pdf, docx, txt, md)", expanded=True):
    uploaded = st.file_uploader("Choose files", accept_multiple_files=True, type=["pdf", "docx", "txt", "md"])
    if uploaded:
        for f in uploaded:
            files = {"file": (f.name, f.getvalue(), f.type or "application/octet-stream")}
            resp = requests.post(f"{BACKEND_URL}/upload", files=files, timeout=120)
            if resp.ok:
                st.success(resp.json().get("message"))
            else:
                st.error(f"Upload failed for {f.name}: {resp.text}")

with st.form("chat_form", clear_on_submit=False):
    mode_label = st.radio("Routing", ["Agent", "RAG", "Web", "Direct"], index=0, horizontal=True)
    mode_map = {"Agent": "auto", "RAG": "rag", "Web": "web", "Direct": "direct"}
    mode = mode_map[mode_label]
    user_input = st.text_input("Ask a question")
    submitted = st.form_submit_button("Send")

if submitted and user_input:
    history = [
        {"user": m["user"], "answer": m["answer"]}
        for m in st.session_state.messages[-5:]
    ]
    payload = {"message": user_input, "mode": mode, "history": history}
    try:
        resp = requests.post(f"{BACKEND_URL}/chat", json=payload, timeout=60)
        if resp.ok:
            data = resp.json()
            st.session_state.messages.append({
                "user": user_input,
                "answer": data.get("answer"),
                "sources": data.get("sources", []),
                "mode": data.get("mode"),
            })
        else:
            st.error(resp.text)
    except requests.exceptions.RequestException as exc:
        st.error(f"Request failed: {exc}")

for msg in reversed(st.session_state.messages[-20:]):
    st.markdown(f"**You:** {msg['user']}")
    st.markdown(f"**{msg['mode'].upper()} Reply:** {msg['answer']}")
    if msg.get("sources") and msg.get("mode") == "rag":
        with st.expander("RAG Sources"):
            for src in msg["sources"]:
                st.markdown(f"- `{src.get('source')}` (score {src.get('score')}) — {src.get('preview')}" )
    if msg.get("sources") and msg.get("mode") == "web":
        with st.expander("Web Sources"):
            for src in msg["sources"]:
                st.markdown(f"- [{src.get('title') or src.get('source')}]({src.get('source')}) (score {src.get('score')})")
    st.divider()
