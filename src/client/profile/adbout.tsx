const AboutUs = () => {
  return (
    <div className="bg-gray-100 text-gray-800">
      {/* Phần tiêu đề */}
      <div className="bg-purple-700 text-white py-6 text-center">
        <h1 className="text-4xl font-bold">Chúng tôi là ai?</h1>
      </div>

      {/* Phần nội dung */}
      <div className="container mx-auto p-6 space-y-12">
        {/* Giới thiệu */}
        <section>
          <h2 className="text-3xl font-bold text-purple-700 mb-4">AP Team</h2>
          <p className="text-lg">
            AP Team là đội ngũ chuyên về lĩnh vực công nghệ thông tin, ra đời
            với mục đích tạo ra những sản phẩm công nghệ đem lại giá trị tích
            cực cho bà con nông dân - nâng tầm nông sản Việt.
          </p>
        </section>

        {/* Tầm nhìn */}
        <section>
          <h2 className="text-3xl font-bold text-purple-700 mb-4">Tầm nhìn</h2>
          <p className="text-lg">
            Tích cực đổi mới, sáng tạo cùng với nghiên cứu để tạo ra những sản
            phẩm mang tính vượt trội, cung cấp tính tiện lợi và thông minh, giải
            quyết vấn đề liên quan đến bảo quản và trao đổi mua bán nông sản
            trên nền tảng kỹ thuật số.
          </p>
        </section>

        {/* Sứ mệnh */}
        <section>
          <h2 className="text-3xl font-bold text-purple-700 mb-4">Sứ mệnh</h2>
          <p className="text-lg italic">“Nâng tầm nông sản Việt”</p>
          <p className="text-lg">
            Với những giải pháp toàn diện và đội ngũ nhân viên dồi dào kinh
            nghiệm, AP Team đảm bảo sẽ mang đến những giải pháp mang tính toàn
            diện nhất về các vấn đề liên quan đến nông sản của bà con nông dân.
          </p>
        </section>

        {/* Giá trị cốt lõi */}
        <section>
          <h2 className="text-3xl font-bold text-purple-700 mb-4">
            Giá trị cốt lõi
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Đội ngũ trẻ, dồi dào kinh nghiệm, mang đến những sản phẩm hỗ trợ
              giải quyết dứt điểm nỗi đau mang tên bảo quản nông sản.
            </li>
            <li>
              Tạo ra môi trường công nghệ hiện đại, tiện dụng và phù hợp cho
              việc kiểm tra và mua bán nông sản trên nền tảng kỹ thuật số.
            </li>
          </ul>
        </section>

        {/* Sản phẩm/Dịch vụ */}
        <section>
          <h2 className="text-3xl font-bold text-purple-700 mb-4">
            Sản phẩm/Dịch vụ
          </h2>
          <p className="text-lg">
            <strong>Mô tả sản phẩm:</strong> APweb được tạo ra nhằm hỗ trợ bà
            con kiểm tra tình hình bảo quản hành tím ký gửi tại công ty và tham
            khảo giá thu mua nông sản từ các nhà vườn uy tín.
          </p>
          <p className="text-lg">
            <strong>Lợi ích:</strong>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Nâng cao chất lượng nông sản bằng phương pháp bảo quản chuyên
                nghiệp.
              </li>
              <li>
                Cải thiện cơ hội tiếp cận với những nhà thu mua nông sản uy tín
                thông qua nền tảng kỹ thuật số.
              </li>
            </ul>
          </p>
        </section>

        {/* Đội ngũ nhân sự */}
        <section>
          <h2 className="text-3xl font-bold text-purple-700 mb-4">
            Đội ngũ nhân sự
          </h2>
          <p className="text-lg">
            Đội ngũ trẻ, dồi dào kinh nghiệm và được đào tạo bài bản, chúng tôi
            cam kết mang lại giá trị tốt đẹp nhất cho bà con nông dân.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Tran Tuan Anh: CEO</li>
            <li>Duong Thien Loc: Chuyên viên tư vấn</li>
            <li>Tran Thai Tan Sang: Trưởng phòng IT</li>
            <li>Bui Ngoc Huy: Trưởng phòng nhân sự</li>
            <li>Le Thi Ngoc Tram: Trưởng phòng Marketing</li>
            <li>Le Nhut Anh Thư: Trưởng phòng Sale</li>
          </ul>
        </section>

        {/* Thành tựu */}
        <section>
          <h2 className="text-3xl font-bold text-purple-700 mb-4">Thành tựu</h2>
          <p className="text-lg">
            - Ký kết hợp đồng sử dụng website với công ty bảo quản hộ nông sản
            VTO Group.
          </p>
        </section>

        {/* Liên hệ */}
        <section>
          <h2 className="text-3xl font-bold text-purple-700 mb-4">
            Thông tin liên hệ
          </h2>
          <p className="text-lg">
            <strong>Số điện thoại:</strong> 0703.437.999
          </p>
          <p className="text-lg">
            <strong>Email:</strong> APTeam8386@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
