import os
import subprocess

def compile_html_to_pdf():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    html_source = os.path.join(base_dir, "build_full_pdf_book.html")
    
    target_dir = os.path.join(base_dir, "..", "7天脉轮身心自愈包", "02_7天身心自愈手册_PDF画册")
    os.makedirs(target_dir, exist_ok=True)
    pdf_output = os.path.join(target_dir, "7天脉轮身心自愈指南_精装画册.pdf")

    edge_paths = [
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
    ]
    edge_exe = next((p for p in edge_paths if os.path.exists(p)), None)

    if not edge_exe:
        print("[ERROR] 未找到 Microsoft Edge 浏览器")
        return False

    print(f"正在使用 Microsoft Edge 打印引擎将画册编译为超高清矢量 PDF...")
    cmd = [
        edge_exe,
        "--headless",
        "--disable-gpu",
        "--run-all-compositor-stages-before-draw",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_output}",
        f"file:///{os.path.abspath(html_source).replace(os.sep, '/')}"
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(pdf_output) and os.path.getsize(pdf_output) > 1000:
        file_size_kb = os.path.getsize(pdf_output) // 1024
        print(f"[SUCCESS] 编译成功！生成 PDF 文件: {pdf_output} (大小: {file_size_kb} KB)")
        return True
    else:
        print(f"[FAIL] 编译失败: {result.stderr}")
        return False

if __name__ == "__main__":
    compile_html_to_pdf()
