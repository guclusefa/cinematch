import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const toastifyOptions = {
    autoClose: 3000,
    position: toast.POSITION.TOP_RIGHT,
    theme: 'colored'
};

export { toast };

const toastPlugin = {
    install: (app: any) => {
        app.use(Vue3Toastify, toastifyOptions);
    }
};

export default toastPlugin;
