# File chi tiết về chức năng của thư mục 
Version 1.0 Làm việc tại thư mục src
  1.1 Thư mục assets : chứa hình ảnh của web
  1.2 Thư mục components : chứa những phần của web có thể tái sử dụng được
  1.3 Thư mục pages : chứa trang của web
  1.4 Thư mục service : chứa các cấu hình cũng như các kết nối API của FE
  1.5 Thư mục styles : Chứa file css của web 
## CÁCH CHẠY DỰ ÁN : npm run dev
# Đã cài đặt 2 thư viện 
- File main.tsx chứa tất cả các đường dẫn của website
- File App.tsx là file chứa layout chung của web 
  + REACT-ROUTER-DOM : để giúp cho làm các đường dẫn của thư mục
  + ANTD : Thư viện hổ trợ giao diện
-> Làm các trang cho các phân quyền phải làm ở từng thư mục của từng phân quyền
-> Nếu có sự thay đổi khác thì phải ghi vào trong file này