import * as yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';

export const validationSchema = yup.object().shape({
    bannerImage: yup.mixed().required('Banner Image is required'),
    bannerDescription: yup.string().required('Banner description is required'),
    bannerLink: yup
        .string()
        .url('Invalid URL')
        .required('Banner link is required'),
    timer: yup
        .mixed()
        .test(
            'is-valid-date',
            'Timer is required',
            (value: any) => value instanceof Dayjs || dayjs(value).isValid()
        )
        .required('Timer is required'),
    showBanner: yup.boolean().required('Toggle is required'),
});
