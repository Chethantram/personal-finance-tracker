import { toast } from "sonner";

const { useState } = require("react");

const UseFetch = (cb)=>{
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

   
        const fetchData = async (...args) => {
            setLoading(true);
            setError(null);
            try {
                const response = await cb(...args);
                setData(response);
               
            } catch (err) {
                setError(err);
                toast.error( err.message || "Error fetching data");
            } finally {
                setLoading(false);
            }
        };

   

    return { data, loading, error,fetchData,setData };
}

export default UseFetch;