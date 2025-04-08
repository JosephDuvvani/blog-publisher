import styled from "styled-components";
import { Link } from "react-router-dom";

const Button = styled(Link)`
    display: block;
    text-decoration: none;
    font-size: .95rem;
    padding: 0;
    border: none;
    color: hsl(240, 43.80%, 43%);
    background-color: transparent;
    cursor: pointer;

    &:focus {
        outline: none;
        border-radius: 4px;
        background-color:hsl(180, 13%, 94%);
    }
`;

const EditButton = ({ postId }) => {
    return (
        <Button to={`posts/${postId}/edit`}>Edit</Button>
    )
}

export default EditButton