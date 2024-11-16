import {create} from "zustand";


export const useStore = create((set , get) => ({
    userInfo : undefined ,

    setUserInfo : (data) => set((state) => ({
        ...state,
        userInfo : data
    })) ,

    reload : false,
    setReload : (data) => set((state) => ({...state , reload : data})) , 

    onlineUsers : [] ,
    setOnlineUsers : (data) => set((state) => ({...state , onlineUsers : data })),
    
    openContactsBar : false,
    setOpenContactBar : (data) => {
        set((state) => ({...state , openContactsBar : data }))
    },
    
    openForwardBar : undefined,
    setOpenForwardBar : (data) => {
        set((state) => ({...state , openForwardBar : data }))
    },


    selectChatMessages : [] ,
    selectedChatData : undefined ,
    selectChatType : undefined ,
    userTypingId : undefined ,

    setUserTypingId : (data) => set((state) => ({...state , userTypingId : data })),
    setSelectedChatData : (data) => set((state) => ({...state , selectedChatData : data })),
    setSelectedChatType : (data) => set((state) => ({...state , selectedChatType : data })),
    setSelectedChatMessages : (data) => set((state) => ({...state , selectChatMessages : data })),
    
    closeChat : () => set({selectChatMessages : [] , selectChatType : undefined , selectedChatData : undefined}),
    
    addMessage : (message) => {
        console.log(message)
        const selectChatMessages = get().selectChatMessages;
        const selectChatType = get().selectChatType;
        set({
            selectChatMessages : [
                ...selectChatMessages ,
                {
                    ...message ,
                    recipient : selectChatType === "group" ? message.recipient : message.recipient._id, 
                    sender : selectChatType === "group" ? message.sender : message.sender._id, 
                }
            ]
        })
    }
    
}));