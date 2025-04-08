import { fetchAnyPost, updatePost } from "../utils/utils";
import { useEffect, useState } from "react";
import Editor from "../components/editor";
import { useNavigate, useParams } from "react-router-dom";
import '../../public/editor.css'

const PostEditor = () => {
    const [content, setContent] = useState();
    const [title, setTitle] = useState();
    const [caption, setCaption] = useState();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const { postId } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPost = async () => {
            await fetchAnyPost(postId, setLoading, setContent, setTitle, setCaption);
        }
        fetchPost();
    }, [])

    const handleUpdate = async (e) => {
        setUpdating(true);
        await updatePost(postId, setUpdating, title, caption, content, navigate);
    }

    if (loading) return <div>Loading...</div>
    return (
        <>
            {content && title && caption &&
                <>
                    <Editor
                        title={title}
                        setTitle={setTitle}
                        caption={caption}
                        setCaption={setCaption}
                        content={content}
                        setContent={setContent}
                    />
                    {updating && <div>Updating...</div>}
                    <button onClick={handleUpdate} className="btn">Save</button>
                </>
            }
        </>
    )
}

export default PostEditor