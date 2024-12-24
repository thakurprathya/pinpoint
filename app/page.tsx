"use client"
import { useEffect, useState } from "react"
import { useUser, useClerk } from "@clerk/nextjs"

import AddUpdateModal from "../components/AddUpdateModal";
import BookmarkTable from "../components/BookmarkTable";
import { setEncryptedItem, getEncryptedItem } from "../lib/encryption";

const Home = () => {
    // Auth states from Clerk
    const { isLoaded, isSignedIn, user } = useUser();
    const { openSignIn } = useClerk();

    interface UserType {
        clerkId: string;
        username: string;
        email: string;
        createdAt?: Date;
        updatedAt?: Date;
    }

    interface TagType {
        _id: string;
        user: string;
        name: string;
        deleted?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }

    interface BookmarkType {
        _id: string;
        user: string;
        link: string;
        title: string;
        description?: string;
        favicon?: string;
        tags: string[];
        createdAt?: Date;
        updatedAt?: Date;
    }

    interface Bookmark {
        _id: string;
        user: string;
        link: string;
        title: string;
        tags: string[];
    }
    
    interface BookmarkMap {
        [key: string]: Bookmark[];
    }

    const [isBtnHovered, setIsBtnHovered] = useState<boolean>(false);
    const [addModal, setAddModal] = useState<boolean>(false);
    const [isContentLoaded, setIsContentLoaded] = useState<boolean>(true);

    const [userObj, setUserObj] = useState<UserType | null>(null);
    const [userTags, setUserTags] = useState<TagType[]>([]);
    const [userBookmarks, setUserBookMarks] = useState<BookmarkType[]>([]);

    const [tags, setTags] = useState<string[]>([]);
    const [bookmarks, setBookmarks] = useState<BookmarkMap | null>(null);

    const [bookmarkToUpdate, setBookmarkToUpdate] = useState<BookmarkType | null>(null);
    const [pageWidth, setPageWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
    
    const HandleAddBookmark = () =>{
        if(!isSignedIn) return openSignIn();
        setBookmarkToUpdate(null);
        setAddModal(true);
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsContentLoaded(false); // Set loading at start
            try {
                if (!isLoaded) return;

                const storedUser = getEncryptedItem('user');
                const storedTags = getEncryptedItem('tags');
                const storedBookmarks = getEncryptedItem('bookmarks');
                if (user?.id) {
                    // Fetch user data if not stored or different user
                    if(!storedUser || !storedUser.clerkId || storedUser.clerkId !== user.id) {
                        const userResponse = await fetch(`/api/users/getUser?id=${user.id}`, {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                            cache: 'no-store'
                        });

                        if (!userResponse.ok) {
                            throw new Error(`Failed to fetch user: ${userResponse.statusText}`);
                        }

                        const userData = await userResponse.json();
                        if (userData) {
                            setUserObj(userData);
                            setEncryptedItem('user', userData);

                            // Fetch tags
                            const tagsResponse = await fetch(`/api/tags/getTags?id=${userData._id}`);
                            const tagsData = await tagsResponse.json();
                            setUserTags(tagsData);

                            // Fetch bookmarks
                            const bookmarksResponse = await fetch(`/api/bookmarks/getBookmarks?id=${userData._id}`);
                            const bookmarksData = await bookmarksResponse.json();
                            setUserBookMarks(bookmarksData);
                        }
                    } else {
                        // Use stored data
                        setUserObj(storedUser);
                        setUserTags([]);
                        setUserBookMarks([]);
                        setTags(storedTags);
                        setBookmarks(storedBookmarks);
                    }
                } 
                else {
                    setEncryptedItem('user', null);
                    setEncryptedItem('tags', null);
                    setEncryptedItem('bookmarks', null);
                    setEncryptedItem('activeTag', null);
                    setUserObj(null);
                    setUserTags([]);
                    setUserBookMarks([]);
                    setTags([]);
                    setBookmarks(null);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setUserObj(null);
                setUserTags([]);
                setUserBookMarks([]);
                setTags([]);
                setBookmarks(null);
                setEncryptedItem('user', null);
                setEncryptedItem('tags', null);
                setEncryptedItem('bookmarks', null);
                setEncryptedItem('activeTag', null);
            } finally {
                setIsContentLoaded(true); // Always set loading to false when done
            }
        };
        fetchData();
    }, [user?.id, isLoaded]);

    useEffect(() => {
        const storedTags = getEncryptedItem('tags');
        if(storedTags && storedTags.length > 0) {
            setTags(storedTags);
        } else {
            const tagNames = userTags.map(tag => tag.name);
            setTags(tagNames);
            setEncryptedItem('tags', tagNames);
        }
    }, [userTags]);

    useEffect(() => {
        const storedBookmarks = getEncryptedItem('bookmarks');
        if(storedBookmarks && Object.keys(storedBookmarks).length > 0){
            setBookmarks(storedBookmarks);
        } else {
            if(userBookmarks.length === 0) {
                setBookmarks(null);
                setEncryptedItem('bookmarks', null);
                return;
            }
    
            const bookmarksByTag: BookmarkMap = {};
            userTags.forEach(tag => {
                bookmarksByTag[tag.name] = userBookmarks.filter(
                    bookmark => bookmark.tags.includes(tag._id)
                ).map(bookmark => ({
                    ...bookmark,
                    tags: bookmark.tags.map(tagId => 
                        userTags.find(t => t._id === tagId)?.name || ''
                    ).filter(name => name !== '')
                }));
            });
    
            setBookmarks(bookmarksByTag);
            setEncryptedItem('bookmarks', bookmarksByTag);
        }
    }, [userBookmarks, userTags]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [user?.id]);

    useEffect(() => {
        const handleResize = () => {
            setPageWidth(window.innerWidth);
        };
        handleResize();
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if(!isLoaded || !isContentLoaded) {
        return (
            <div className="flex items-center justify-center w-full h-[100vh]">
                <iframe src="/loader.html" className="w-20 h-20"></iframe>
            </div>
        );
    }

    return (
        <div className="min-h-[100vh] flex flex-col items-center p-5 md:p-10">
            {addModal ? <AddUpdateModal tags={tags} setTags={setTags} bookmarks={bookmarks} setBookmarks={setBookmarks} setAddModal={setAddModal} bookmarkToUpdate={bookmarkToUpdate} pageWidth={pageWidth}/> : <></>}
            <div className="flex flex-col items-center gap-2 mt-[7rem]">
                <h1 className="text-[#F0BB78] font-semibold text-2xl md:text-3xl text-center">Centralized Bookmark Management</h1>
                <p className="text-left w-[90%] text-[12px] md:text-[14px] md:w-auto">Organize and maintain your bookmarks efficiently with easy-to-use tools for saving, categorizing, and accessing your favorite websites.</p>
            </div>

            <div className="mt-[3rem] md:mt-[5rem] flex flex-col items-center gap-[5rem] w-[90%] md:w-[70%]">
                <button
                onMouseEnter={() => setIsBtnHovered(true)} 
                onMouseLeave={() => setIsBtnHovered(false)} 
                onClick={HandleAddBookmark}
                className="flex items-center gap-2 rounded-lg p-4 md:p-5 md:hover:bg-[#F0BB78] transition-colors duration-200"
                >
                    <svg viewBox="0 0 20 20" fill="currentColor" className={`w-7 fill-[#F0BB78] ${isBtnHovered ? 'md:fill-[#543A14]' : 'fill-[#F0BB78]'} transition-colors duration-200`} >
                        <path d="M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 110-20 10 10 0 010 20z" />
                    </svg>
                    <p className={`text-[12px] md:text-lg text-[#F0BB78] ${isBtnHovered ? 'md:text-[#131010]' : 'text-[#F0BB78]'} transition-colors duration-200`}>Add Bookmark</p>
                </button>

                <BookmarkTable tags={tags} setTags={setTags} bookmarks={bookmarks} setBookmarks={setBookmarks} isSignedIn={isSignedIn} setAddModal={setAddModal} setBookmarkToUpdate={setBookmarkToUpdate}/>
            </div>
        </div>
    )
}

export default Home;
