const badWords=['死ね','最悪','バカ','アホ'];
const params=new URLSearchParams(location.search);
const postId=params.get('post')||0;
let comments=JSON.parse(localStorage.getItem('comments_'+postId)||'[]');
function render(){
 document.getElementById('comments').innerHTML='';
 comments.forEach(c=>{
  const div=document.createElement('div');
  div.className='comment-box';
  div.textContent=`${c.user}: ${c.text}`;
  document.getElementById('comments').appendChild(div);
 });
}
function addComment(){
 const user=document.getElementById('username').value||'匿名';
 const text=document.getElementById('commentInput').value;
 if(badWords.some(w=>text.includes(w))){ alert('不適切な表現が含まれています。'); return; }
 comments.push({user,text});
 localStorage.setItem('comments_'+postId,JSON.stringify(comments));
 document.getElementById('commentInput').value='';
 render();
}
render();
