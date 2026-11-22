import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = (queryOverride) => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    const query = queryOverride ?? searchedQuery;
    useEffect(()=>{
        const controller = new AbortController();
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${encodeURIComponent(query)}`,{withCredentials:true, signal: controller.signal});
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
        return () => controller.abort();
    },[query, dispatch])
}

export default useGetAllJobs
