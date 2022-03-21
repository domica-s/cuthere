import React, {useState} from 'react'; 
import Modal from 'react-modal';
import Datetime from 'react-datetime';

export default function ({isOpen, onClose, onEventAdded}) {
    const [title, setTitle] = useState();
    const [location, setLocation] = useState();
    const [quota, setQuota] = useState();
    const [category, setCategory] = useState();
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());

    const onSubmit = (event) => {
        event.preventDefault();

        onEventAdded({
            title,
            location,
            quota,
            category,
            start,
            end
        })
        onClose();
    }



    return (
        <Modal isOpen = {isOpen} onRequestClose ={onClose}>
            <form onSubmit={onSubmit} method="post" encType="application/x-www-form-urlencoded; charset=UTF-8;application/json">
                <div>
                    <input placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} />
                </div>

                <div>
                    <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
                </div>

                <div>
                    <input placeholder="Event Quota" value={quota} onChange={e => setQuota(e.target.value)} />
                </div>

                <div>
                    <input placeholder="Activity Category" value={category} onChange={e => setCategory(e.target.value)} />
                </div>
                
                <div>
                    <label>Start Date</label>
                    <Datetime value ={start} onChange ={date => setStart(date)} />
                </div>

                <div>
                    <label>End Date</label>
                    <Datetime value ={end} onChange ={date => setEnd(date)} />
                </div>

                <button>Add Event</button>
            
            </form>
        </Modal>
    )
}