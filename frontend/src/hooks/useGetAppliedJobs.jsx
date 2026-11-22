import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(()=>{
        const controller = new AbortController();
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {withCredentials:true, signal: controller.signal});
                if(res.data.success){
                    dispatch(setAllAppliedJobs(res.data.application));
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    dispatch(setAllAppliedJobs([]));
                    setError(error.response?.status === 401 ? 'Please sign in again to view your applications.' : 'Unable to load applications right now. Refresh to try again.');
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        fetchAppliedJobs();
        return () => controller.abort();
    },[dispatch])
    return {loading, error};
};
export default useGetAppliedJobs;
