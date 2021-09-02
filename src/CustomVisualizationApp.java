import java.io.File;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.util.AbstractSampleApp;

public class CustomVisualizationApp extends AbstractSampleApp {

	public static void main(String[] args) {
		main(new CustomVisualizationApp(), args);
	}

	@Override
	public void test() throws JRException {
		fill();
		pdf();
	}

	public void fill() throws JRException {
		File[] files = getFiles(new File("build/reports"), "jasper");
		for (int i = 0; i < files.length; i++) {
			File reportFile = files[i];
			long start = System.currentTimeMillis();
			JasperFillManager.fillReportToFile(reportFile.getAbsolutePath(), null, getDemoHsqldbConnection());
			System.err.println("Report : " + reportFile + ". Filling time : " + (System.currentTimeMillis() - start));
		}
	}

	public void pdf() throws JRException {
		File[] files = getFiles(new File("build/reports"), "jrprint");
		for (int i = 0; i < files.length; i++) {
			File reportFile = files[i];
			long start = System.currentTimeMillis();
			JasperExportManager.exportReportToPdfFile(reportFile.getAbsolutePath());
			System.err.println("Report : " + reportFile + ". PDF export time : " + (System.currentTimeMillis() - start));
		}
	}

}
