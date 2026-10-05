import axios from "axios";

const WORDPRESS_API_URL = 'http://127.0.0.1/wp-json/wp/v2';

export const getPosts = async () => {
    try {
        const response = await axios.get(`${WORDPRESS_API_URL}/post`);
        return response.data;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
};