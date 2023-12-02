import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { AiFillDelete, AiFillEdit, AiFillSave } from "react-icons/ai";
import "./UsersList.css";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [editableRow, setEditableRow] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const itemPerPage = 10;
  let pageVisited = pageCount * itemPerPage;
  const totalPages = Math.ceil(users.length / itemPerPage);

  const pageChange = ({ selected }) => {
    setPageCount(selected);
  };

  useEffect(() => {
    getUsersDetails();
  }, []);

  const getUsersDetails = () => {
    fetch(
      `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };



  const deleteUser = (selectedUserId) => {
    let userAfterDeletion = users.filter((user) => {
      return user.id !== selectedUserId;
    });
    setUsers(userAfterDeletion);
    setSelectedUserIds([]); // Clear selected user ids after deletion
  };



  const toggleSelectUser = (userId) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds((prevIds) => prevIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds((prevIds) => [...prevIds, userId]);
    }
  };

  //  const editUserDetails = () => {};
  const editUserDetails = (userId) => {
    setEditableRow(userId);
  };

  const saveEditedDetails = (userId) => {
    // Implement logic to save edited details
    setEditableRow(null); // Set editableRow back to null to disable editing
  };

  return (
    <div className="con">
      <div className="srch">
        <input
          id="search"
          type="text"
          name="name"
          placeholder=" Search"
          onChange={(e) => setSearchUser(e.target.value)}
        />
      </div>
      <div
        className="delete-selected"
        onClick={() => {
          // Delete selected users
          selectedUserIds.forEach((userId) => deleteUser(userId));
        }}
      >
        <AiFillDelete />
      </div>
      <div className="container">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => {
                if (searchUser === "") return user;
                else if (
                  user.name.includes(searchUser) ||
                  user.email.includes(searchUser) ||
                  user.role.includes(searchUser)
                ) {
                  return user;
                }
              })
              .slice(pageVisited, pageVisited + itemPerPage)
              .map((user) => (
                <tr key={user.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{editableRow === user.id ? <input value={user.name} /> : user.name}</td>
                  <td>{editableRow === user.id ? <input value={user.email} /> : user.email}</td>
                  <td>{editableRow === user.id ? <input value={user.role} /> : user.role}</td>
                  <td className="btn">
                    {editableRow === user.id ? (
                      <AiFillSave onClick={() => saveEditedDetails(user.id)} />
                    ) : (
                      <AiFillEdit onClick={() => editUserDetails(user.id)} />
                    )}
                    <AiFillDelete onClick={() => deleteUser(user.id)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* pagination */}
      <div className="pagination-container">
        <ul className="bottom">
          <li className="go-to-first-page">
            <button
              onClick={() => setPageCount(0)}
              disabled={pageCount === 0}
            >
              {"<<"}
            </button>
          </li>
          <li className="Previous-Button">
            <button
              onClick={() => setPageCount(pageCount - 1)}
              disabled={pageCount === 0}
            >
              {"<"}
            </button>
          </li>

          
          <li className="current-page">
            Page: {pageCount + 1} of {totalPages}
          </li>

          <li className="Next-Button">
            <button
              onClick={() => setPageCount(pageCount + 1)}
              disabled={pageCount === totalPages - 1}
            >
              {">"}
            </button>
          </li>
          <li className="go-to-last-page">
            <button onClick={() => setPageCount(totalPages-1)}
              disabled={pageCount === 0}>{">>"}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UsersList;
