import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import Admin from '@/api/admin';
import Account from '@/api/account';

export const useAccountStore = defineStore('account', () => {
    //state---当前帐户信息
    let profile = ref({});

    //action---加载账户资料
    let loadProfile = async (id) => {
        try {
            let { status, msg, data } = await Admin.info({ id });
            if (status) {
                profile.value = { ...data };
            }
        } catch (error) {
            console.log(error);
        }

    }
    //修改账户资料
    let updateProfile = async (data) => {
        try {
            let { status, msg } = await Account.account(data);
            console.log(data, "a");
            if (status) {
                //更新数据
                profile.value = { ...data };
                ElMessage.success(msg);
            } else {
                //未通过校验
                // console.log('校验失败(字段)', fields);
                //注册失败
                ElMessage.error("校验未通过，保存修改失败！");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return {
        profile,
        loadProfile,
        updateProfile,
    }

}, { persist: true });